#!/usr/bin/env python3
import os
import sys
import re
import shutil
import datetime

# Regular expressions for validation
DATE_PATTERN = re.compile(r'^\d{4}-\d{2}-\d{2}$')
HR_PATTERN = re.compile(r'^\s*([-*_])\s*(\1\s*){2,}\s*$')
LIST_ITEM_PATTERN = re.compile(r'^(\s*)([*+\-]|\d+\.)\s+(.*)$')
BOLD_HEADING_PATTERN = re.compile(r'^\s*\*\*([^*]+)\*\*:\?\s*$')

def parse_frontmatter(lines):
    if not lines or lines[0].strip() != '---':
        return None, -1, ["YAML frontmatter is missing (Line 1)"]
    
    end_idx = -1
    for i in range(1, len(lines)):
        if lines[i].strip() == '---':
            end_idx = i
            break
            
    if end_idx == -1:
        return None, -1, ["YAML frontmatter has no closing '---' delimiter"]
        
    data = {}
    errors = []
    
    for idx in range(1, end_idx):
        line = lines[idx]
        if not line.strip():
            continue
        if ':' not in line:
            errors.append(f"Invalid YAML line in frontmatter (Line {idx + 1}): `{line.strip()}`")
            continue
            
        key, val = line.split(':', 1)
        key = key.strip()
        val = val.strip().strip('"').strip("'")
        data[key] = val
        
    required = {'title', 'date', 'description'}
    present_keys = set(data.keys())
    
    missing = required - present_keys
    for key in missing:
        errors.append(f"Missing required frontmatter field: `{key}`")
        
    if 'date' in data:
        date_val = data['date']
        if not DATE_PATTERN.match(date_val):
            errors.append(f"Frontmatter field `date` does not match `YYYY-MM-DD` format (got `{date_val}`)")
            
    if 'title' in data and not data['title']:
        errors.append("Frontmatter field `title` is empty")
    if 'description' in data and not data['description']:
        errors.append("Frontmatter field `description` is empty")
        
    return data, end_idx, errors

def calculate_date_from_filename(filename):
    match = re.search(r'Notes\s*-\s*(\d+)', filename, re.IGNORECASE)
    if match:
        lecture_num = int(match.group(1))
        # Start date: Monday, Feb 9, 2026
        start_date = datetime.date(2026, 2, 9)
        lecture_date = start_date + datetime.timedelta(weeks=lecture_num)
        return lecture_date.strftime("%Y-%m-%d")
    return "2026-06-06"

def generate_description(lines, fm_end_idx):
    in_code = False
    for idx, line in enumerate(lines):
        if idx <= fm_end_idx:
            continue
        stripped = line.strip()
        if stripped.startswith('```'):
            in_code = not in_code
            continue
        if in_code:
            continue
        if stripped.startswith('#') or not stripped:
            continue
        if BOLD_HEADING_PATTERN.match(stripped):
            continue
        clean = re.sub(r'\*\*([^*]+)\*\*', r'\1', stripped)
        clean = re.sub(r'\*([^*]+)\*', r'\1', clean)
        clean = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', clean)
        clean = clean.replace('\\', '').strip()
        if clean:
            if len(clean) > 150:
                return clean[:147].strip() + "..."
            return clean
    return "Study notes for COMP341 Introduction to Artificial Intelligence course."

def clean_heading(heading_text):
    # Only keep alphanumeric characters and spaces
    cleaned = re.sub(r'[^a-zA-Z0-9\s]', '', heading_text)
    # Normalize spaces
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned

def clean_filename(filename):

    base, ext = os.path.splitext(filename)
    # Only keep alphanumeric characters and hyphens in the base name
    cleaned = re.sub(r'[^a-zA-Z0-9-]', '-', base)
    # Normalize hyphens
    cleaned = re.sub(r'-+', '-', cleaned)
    # Strip leading and trailing hyphens
    cleaned = cleaned.strip('-')
    return cleaned + ext


def process_file(filepath):
    filename = os.path.basename(filepath)
    with open(filepath, 'r', encoding='utf-8') as f:
        original_content = f.read()
        
    auto_fixes = []
    manual_actions = []
    
    if '—' in original_content:
        content_replaced = original_content.replace('—', '-')
        auto_fixes.append("Replaced all em-dashes `—` with hyphens `-`")
    else:
        content_replaced = original_content
        
    lines = content_replaced.splitlines(keepends=True)    # 1. Frontmatter check and auto-generation/fixing
    frontmatter, fm_end_idx, fm_errors = parse_frontmatter(lines)
    
    if frontmatter is None and fm_end_idx == -1:
        # Prepend new frontmatter
        h1_text = None
        in_code_block = False
        for idx, line in enumerate(lines):
            if line.strip().startswith('```'):
                in_code_block = not in_code_block
                continue
            if in_code_block:
                continue
            stripped = line.lstrip()
            if stripped.startswith('# '):
                h1_text = stripped[2:].strip()
                break
        
        if not h1_text:
            h1_text = os.path.splitext(filename)[0]
            
        cleaned_t = clean_heading(h1_text)
        date_str = calculate_date_from_filename(filename)
        description = generate_description(lines, -1)
        
        fm_lines = [
            "---\n",
            f"title: \"{cleaned_t}\"\n",
            f"date: \"{date_str}\"\n",
            f"description: \"{description}\"\n",
            "---\n\n"
        ]
        lines = fm_lines + lines
        fm_end_idx = 4
        frontmatter = {
            'title': cleaned_t,
            'date': date_str,
            'description': description
        }
        auto_fixes.append(f"Generated missing frontmatter (title: `{cleaned_t}`, date: `{date_str}`, description: `{description}`)")
    elif frontmatter is not None:
        fm_lines = lines[1:fm_end_idx]
        modified_fm = False
        
        if 'title' in frontmatter and frontmatter['title']:
            orig_t = frontmatter['title']
            cleaned_t = clean_heading(orig_t)
            if cleaned_t != orig_t:
                frontmatter['title'] = cleaned_t
                for idx, l in enumerate(fm_lines):
                    if l.strip().startswith('title:'):
                        indent = l[:len(l) - len(l.lstrip())]
                        fm_lines[idx] = f"{indent}title: \"{cleaned_t}\"\n"
                        break
                auto_fixes.append(f"Sanitized frontmatter title: `{orig_t}` -> `{cleaned_t}`")
                modified_fm = True
                
        if 'title' not in frontmatter or not frontmatter['title']:
            h1_text = None
            in_code_block = False
            for idx, line in enumerate(lines):
                if idx <= fm_end_idx:
                    continue
                if line.strip().startswith('```'):
                    in_code_block = not in_code_block
                    continue
                if in_code_block:
                    continue
                stripped = line.lstrip()
                if stripped.startswith('# '):
                    h1_text = stripped[2:].strip()
                    break
            if not h1_text:
                h1_text = os.path.splitext(filename)[0]
            cleaned_t = clean_heading(h1_text)
            frontmatter['title'] = cleaned_t
            fm_lines.append(f"title: \"{cleaned_t}\"\n")
            auto_fixes.append(f"Added missing `title` to frontmatter: `{cleaned_t}`")
            modified_fm = True
            
        if 'date' not in frontmatter or not DATE_PATTERN.match(frontmatter.get('date', '')):
            date_str = calculate_date_from_filename(filename)
            frontmatter['date'] = date_str
            fm_lines = [l for l in fm_lines if not l.strip().startswith('date:')]
            fm_lines.append(f"date: \"{date_str}\"\n")
            auto_fixes.append(f"Added/corrected `date` in frontmatter: `{date_str}`")
            modified_fm = True
            
        if 'description' not in frontmatter or not frontmatter['description']:
            description = generate_description(lines, fm_end_idx)
            frontmatter['description'] = description
            fm_lines.append(f"description: \"{description}\"\n")
            auto_fixes.append(f"Added missing `description` to frontmatter: `{description}`")
            modified_fm = True
            
        if modified_fm:
            lines = [lines[0]] + fm_lines + lines[fm_end_idx:]
            
    title = frontmatter.get('title')
    
    # 2 & 3. Heading extraction (need to skip code blocks and frontmatter)
    headings = []
    in_code_block = False
    
    for idx, line in enumerate(lines):
        if idx <= fm_end_idx:
            continue
        if line.strip().startswith('```'):
            in_code_block = not in_code_block
            continue
        if in_code_block:
            continue
            
        stripped = line.lstrip()
        if stripped.startswith('#'):
            hashes = len(stripped) - len(stripped.lstrip('#'))
            if hashes <= 6:
                after_hashes = stripped[hashes:]
                if after_hashes.startswith(' ') or after_hashes == '':
                    h_level = hashes
                    h_text = after_hashes.strip()
                    
                    # Clean heading text if it is H1, H2, or H3
                    if h_level <= 3:
                        cleaned_h_text = clean_heading(h_text)
                        if cleaned_h_text != h_text:
                            indent = line[:len(line) - len(stripped)]
                            lines[idx] = f"{indent}{'#' * h_level} {cleaned_h_text}\n"
                            auto_fixes.append(f"Sanitized heading on line {idx+1}: `{h_text}` -> `{cleaned_h_text}`")
                            h_text = cleaned_h_text
                    headings.append((idx, h_level, h_text))

    # Check H1 heading(s)
    h1_headings = [h for h in headings if h[1] == 1]
    if len(h1_headings) == 0:
        manual_actions.append("H1 heading: No H1 (#) heading found in the file.")
    elif len(h1_headings) > 1:
        for h in h1_headings:
            manual_actions.append(f"H1 heading: Multiple H1 headings found (Line {h[0]+1}: `{h[2]}`)")
    else:
        h1_idx, _, h1_text = h1_headings[0]
        if title:
            if h1_text != title:
                indent = lines[h1_idx][:len(lines[h1_idx]) - len(lines[h1_idx].lstrip())]
                lines[h1_idx] = f"{indent}# {title}\n"
                auto_fixes.append(f"Updated H1 text on line {h1_idx+1} to match frontmatter title (`{title}`)")
        else:
            manual_actions.append(f"H1 heading: Frontmatter title is missing, cannot verify H1 matching (Line {h1_idx+1}: `{h1_text}`)")

    # Heading hierarchy check
    for h in headings:
        if h[1] >= 4:
            manual_actions.append(f"Heading hierarchy: Heading level {h[1]} is too deep (Line {h[0]+1}: `{h[2]}`)")
            
    # Auto-resolve duplicate headings at the same level by appending parent context
    by_level = {}
    for idx, level, text in headings:
        if level not in by_level:
            by_level[level] = []
        by_level[level].append((idx, text))
        
    for level, h_list in by_level.items():
        if level < 2:  # H1 is checked separately
            continue
        seen = {}
        for idx, text in h_list:
            norm_text = text.lower().strip()
            if norm_text in seen:
                seen[norm_text].append(idx)
            else:
                seen[norm_text] = [idx]
        for norm_text, idxs in seen.items():
            if len(idxs) > 1:
                # Rename all of them using parent context for uniqueness
                for idx in idxs:
                    original_line = lines[idx]
                    parent_text = ""
                    for k in range(idx - 1, -1, -1):
                        l_stripped = lines[k].lstrip()
                        if l_stripped.startswith('#'):
                            p_hashes = len(l_stripped) - len(l_stripped.lstrip('#'))
                            if p_hashes < level:
                                parent_text = l_stripped[p_hashes:].strip()
                                break
                    if parent_text:
                        parent_clean = re.sub(r'^[\d.\s]+', '', parent_text).strip()
                        curr_text = h_list[[x[0] for x in h_list].index(idx)][1]
                        
                        curr_lower = curr_text.lower().strip()
                        if curr_lower == 'concept':
                            new_text = f"Concept of {parent_clean}"
                        elif curr_lower == 'motivation':
                            new_text = f"Motivation for {parent_clean}"
                        elif curr_lower == 'how it works':
                            new_text = f"How {parent_clean} Works"
                        elif curr_lower == 'core idea':
                            new_text = f"Core Idea of {parent_clean}"
                        elif curr_lower == 'implementation':
                            new_text = f"Implementation of {parent_clean}"
                        elif curr_lower == 'pseudocode':
                            new_text = f"Pseudocode of {parent_clean}"
                        elif curr_lower == 'the idea':
                            new_text = f"The Idea of {parent_clean}"
                        elif curr_lower == 'formulation':
                            new_text = f"Formulation of {parent_clean}"
                        elif curr_lower == 'intuition':
                            new_text = f"Intuition for {parent_clean}"
                        elif curr_lower == 'worked example':
                            new_text = f"Worked Example for {parent_clean}"
                        elif curr_lower == 'algorithm':
                            new_text = f"Algorithm for {parent_clean}"
                        elif curr_lower == 'joint distribution':
                            new_text = f"Joint Distribution of {parent_clean}"
                        elif curr_lower == 'the question':
                            new_text = f"The Question of {parent_clean}"
                        else:
                            new_text = f"{curr_text} {parent_clean}"

                            
                        indent = original_line[:len(original_line) - len(original_line.lstrip())]
                        hashes_str = "#" * level
                        lines[idx] = f"{indent}{hashes_str} {new_text}\n"
                        auto_fixes.append(f"Renamed duplicate heading on line {idx+1} from `{curr_text}` to `{new_text}`")

    # Check bold text used as a visual heading substitute
    in_code_block = False
    for idx, line in enumerate(lines):
        if idx <= fm_end_idx:
            continue
        if line.strip().startswith('```'):
            in_code_block = not in_code_block
            continue
        if in_code_block:
            continue
            
        stripped = line.strip()
        if BOLD_HEADING_PATTERN.match(stripped):
            is_before_content = False
            for k in range(idx + 1, len(lines)):
                next_line = lines[k]
                next_stripped = next_line.strip()
                if next_stripped == '':
                    continue
                if next_stripped.startswith('#') or next_stripped.startswith('```'):
                    break
                if LIST_ITEM_PATTERN.match(next_line) and not HR_PATTERN.match(next_stripped):
                    break
                if HR_PATTERN.match(next_stripped):
                    break
                is_before_content = True
                break
                
            if is_before_content:
                manual_actions.append(f"Heading hierarchy: Bold text used as visual heading substitute (Line {idx+1}: `{stripped}`)")

    # 4. Table of Contents — remove
    toc_start_idx = -1
    for idx, line in enumerate(lines):
        if line.strip().lower() == '## table of contents':
            toc_start_idx = idx
            break
            
    if toc_start_idx != -1:
        end_idx = toc_start_idx + 1
        while end_idx < len(lines):
            line = lines[end_idx]
            stripped = line.strip()
            if stripped == '':
                end_idx += 1
                continue
            is_list = False
            if LIST_ITEM_PATTERN.match(line):
                if not HR_PATTERN.match(stripped):
                    is_list = True
            if is_list:
                end_idx += 1
                continue
            if HR_PATTERN.match(stripped):
                end_idx += 1
                break
            break
        del lines[toc_start_idx:end_idx]
        auto_fixes.append(f"Removed Table of Contents block (lines {toc_start_idx+1} to {end_idx})")
        if fm_end_idx >= toc_start_idx:
            fm_end_idx -= (end_idx - toc_start_idx)

    # 5. Code blocks — language tags
    in_code_block = False
    block_start_idx = -1
    block_lines = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if line.strip().startswith('```'):
            if not in_code_block:
                in_code_block = True
                block_start_idx = i
                block_lines = []
                i += 1
            else:
                in_code_block = False
                start_line = lines[block_start_idx]
                tag = start_line.strip()[3:].strip()
                if not tag:
                    block_content = "".join(block_lines)
                    context_before = ""
                    for k in range(max(0, block_start_idx - 3), block_start_idx):
                        context_before += lines[k]
                    context_lower = context_before.lower()
                    
                    inferred_tag = None
                    if "python" in context_lower:
                        inferred_tag = "python"
                    elif "javascript" in context_lower or "js" in context_lower:
                        inferred_tag = "javascript"
                    elif "typescript" in context_lower or "ts" in context_lower:
                        inferred_tag = "typescript"
                    elif "c code" in context_lower or "written in c" in context_lower or "c program" in context_lower:
                        inferred_tag = "c"
                    elif "bash" in context_lower or "shell script" in context_lower:
                        inferred_tag = "bash"
                    elif "assembly" in context_lower or "asm" in context_lower:
                        inferred_tag = "asm"
                    elif "sql" in context_lower:
                        inferred_tag = "sql"
                        
                    if not inferred_tag:
                        is_pseudocode_or_diagram = False
                        math_chars = ['γ', 'θ', 'α', 'β', 'π', 'Σ', 'σ', 'μ', 'ε', 'λ', 'τ', '∝', '≈', '≠', '≤', '≥', '∫', '∞', '∇', '∂', '≈', '⁺', '⁻']
                        math_keywords = ['sum over', 'product over', 'argmax', 'argmin', 'max_a', 'min_a', 'max ', 'min ', 'log(', 'exp(', 'sqrt(', 'integral', '->', '<-', '=>', '<=']
                        if any(arrow in block_content for arrow in ["→", "←", "⇒", "⇔"]):
                            is_pseudocode_or_diagram = True
                        elif any(c in block_content for c in math_chars):
                            is_pseudocode_or_diagram = True
                        elif any(kw in block_content.lower() for kw in math_keywords):
                            is_pseudocode_or_diagram = True
                        elif "did i" in block_content.lower() or "how good is" in block_content.lower():
                            is_pseudocode_or_diagram = True
                        elif "create k" in block_content.lower() or "for each" in block_content.lower():
                            is_pseudocode_or_diagram = True
                        elif "function " in block_content and "(" in block_content:
                            is_pseudocode_or_diagram = True
                        elif "procedure " in block_content:
                            is_pseudocode_or_diagram = True
                        elif "return " in block_content and ("algorithm" in context_lower or "pseudocode" in context_lower):
                            is_pseudocode_or_diagram = True
                        
                        box_chars = sum(block_content.count(c) for c in ['|', '+', '-', '*', '#'])
                        if box_chars > 10 and len(block_lines) > 2:
                            is_pseudocode_or_diagram = True
                            
                        if is_pseudocode_or_diagram:
                            inferred_tag = "text"
                            
                    if inferred_tag:
                        indent = start_line[:len(start_line) - len(start_line.lstrip())]
                        lines[block_start_idx] = f"{indent}```{inferred_tag}\n"
                        auto_fixes.append(f"Added language tag `{inferred_tag}` to code block starting on line {block_start_idx+1}")
                    else:
                        snippet = "".join(block_lines[:3]).strip()
                        if len(block_lines) > 3:
                            snippet += "\n..."
                        manual_actions.append(f"Code block: Bare code block on line {block_start_idx+1} has no language tag. Content:\n```\n{snippet}\n```")
                i += 1
        else:
            if in_code_block:
                block_lines.append(line)
            i += 1

    # 6. Tables — header, separator, alignment
    in_code_block = False
    i = 0
    while i < len(lines):
        line = lines[i]
        if line.strip().startswith('```'):
            in_code_block = not in_code_block
            i += 1
            continue
        if in_code_block:
            i += 1
            continue
            
        if line.strip().startswith('|') and line.strip().endswith('|'):
            table_lines = []
            start_line_idx = i
            while i < len(lines) and lines[i].strip().startswith('|') and lines[i].strip().endswith('|'):
                table_lines.append(lines[i])
                i += 1
                
            if len(table_lines) < 2:
                continue
                
            header = table_lines[0]
            separator = table_lines[1]
            data_rows = table_lines[2:]
            
            def parse_row(row_str):
                # Split on pipes that are not preceded by backslashes
                parts = re.split(r'(?<!\\)\|', row_str.strip())
                if parts and parts[0] == '':
                    parts = parts[1:]
                if parts and parts[-1] == '':
                    parts = parts[:-1]
                return [p.strip().replace(r'\|', '|') for p in parts]
                
            header_cols = parse_row(header)
            num_cols = len(header_cols)
            
            sep_stripped = separator.strip().replace(' ', '').replace('|', '').replace('-', '').replace(':', '')
            is_separator = (sep_stripped == '') and ('-' in separator)
            
            if not is_separator:
                manual_actions.append(f"Table: Separator row is missing or invalid (Line {start_line_idx+2})")
                continue
                
            sep_cols = parse_row(separator)
            
            inconsistent = False
            for r_idx, row in enumerate(table_lines):
                cols = parse_row(row)
                if len(cols) != num_cols:
                    inconsistent = True
                    manual_actions.append(f"Table: Row has inconsistent column count (Line {start_line_idx+r_idx+1}, expected {num_cols}, got {len(cols)})")
                    
            if inconsistent:
                continue
                
            new_sep_cols = []
            changed_sep = False
            
            for col_idx in range(num_cols):
                sep_val = sep_cols[col_idx]
                has_left = sep_val.startswith(':')
                has_right = sep_val.endswith(':')
                
                if not has_left and not has_right:
                    col_data = []
                    for row in data_rows:
                        cols = parse_row(row)
                        if col_idx < len(cols):
                            col_data.append(cols[col_idx])
                            
                    numeric_count = 0
                    short_count = 0
                    total_non_empty = 0
                    
                    for val in col_data:
                        val_strip = val.strip()
                        if not val_strip:
                            continue
                        total_non_empty += 1
                        num_cleaned = val_strip.replace('%', '').replace('$', '').replace('€', '').replace(',', '').replace('.', '').replace('-', '').strip()
                        if num_cleaned.isdigit():
                            numeric_count += 1
                        if len(val_strip) <= 6 or val_strip.lower() in ['yes', 'no', 'true', 'false', 'y', 'n', '✓', '✗', '—', '-']:
                            short_count += 1
                            
                    if total_non_empty == 0:
                        inferred = ":---"
                    elif numeric_count == total_non_empty:
                        inferred = "---:"
                    elif short_count == total_non_empty:
                        inferred = ":---:"
                    else:
                        inferred = ":---"
                        
                    new_sep_cols.append(inferred)
                    changed_sep = True
                else:
                    new_sep_cols.append(sep_val)
                    
            if changed_sep:
                indent = separator[:len(separator) - len(separator.lstrip())]
                lines[start_line_idx+1] = f"{indent}| " + " | ".join(new_sep_cols) + " |\n"
                auto_fixes.append(f"Updated alignment colons in table separator on line {start_line_idx+2}")
        else:
            i += 1

    # 7. Lists — unordered marker and indentation
    in_code_block = False
    list_stack = []
    in_list = False
    i = 0
    while i < len(lines):
        line = lines[i]
        if line.strip().startswith('```'):
            in_code_block = not in_code_block
            list_stack = []
            in_list = False
            i += 1
            continue
        if in_code_block:
            i += 1
            continue
            
        is_list_item = False
        match = LIST_ITEM_PATTERN.match(line)
        if match:
            marker = match.group(2)
            if marker in ['-', '*']:
                rest = match.group(3)
                if HR_PATTERN.match(marker + rest):
                    is_list_item = False
                else:
                    is_list_item = True
            else:
                is_list_item = True
                
        if is_list_item:
            indent_spaces = match.group(1)
            marker = match.group(2)
            content = match.group(3)
            orig_indent = len(indent_spaces)
            
            if not in_list:
                in_list = True
                list_stack = [orig_indent]
                norm_indent = 0
            else:
                if orig_indent > list_stack[-1]:
                    list_stack.append(orig_indent)
                    norm_indent = 2 * (len(list_stack) - 1)
                elif orig_indent == list_stack[-1]:
                    norm_indent = 2 * (len(list_stack) - 1)
                else:
                    while len(list_stack) > 1 and list_stack[-1] > orig_indent:
                        list_stack.pop()
                    if list_stack[-1] != orig_indent:
                        list_stack[-1] = orig_indent
                    norm_indent = 2 * (len(list_stack) - 1)
                    
            new_marker = marker
            if marker in ['*', '+']:
                new_marker = '-'
                
            new_indent_str = " " * norm_indent
            new_line = f"{new_indent_str}{new_marker} {content}\n"
            
            if new_line != line:
                fix_desc = []
                if marker != new_marker:
                    fix_desc.append(f"marker `{marker}` -> `{new_marker}`")
                if orig_indent != norm_indent:
                    fix_desc.append(f"indentation {orig_indent} -> {norm_indent} spaces")
                auto_fixes.append(f"Normalized list item on line {i+1}: " + " and ".join(fix_desc))
                lines[i] = new_line
        else:
            if line.strip() != '':
                in_list = False
                list_stack = []
        i += 1

    # 8. Horizontal rules — remove (except frontmatter)
    in_code_block = False
    i = 0
    while i < len(lines):
        line = lines[i]
        if i == 0 or i == fm_end_idx:
            i += 1
            continue
        if line.strip().startswith('```'):
            in_code_block = not in_code_block
            i += 1
            continue
        if in_code_block:
            i += 1
            continue
            
        stripped = line.strip()
        if HR_PATTERN.match(stripped) and '|' not in line:
            auto_fixes.append(f"Removed horizontal rule on line {i+1}")
            del lines[i]
            if fm_end_idx >= i:
                fm_end_idx -= 1
        else:
            i += 1

    fixed_content = "".join(lines)
    return fixed_content, auto_fixes, manual_actions

def main():
    if len(sys.argv) > 1:
        targets = sys.argv[1:]
    else:
        print("Usage: python3 lint_markdown.py <file1.md> [file2.md ...]")
        sys.exit(1)
        
    for filepath in targets:
        if not os.path.exists(filepath):
            print(f"File not found: {filepath}")
            continue
            
        dir_name = os.path.dirname(filepath)
        filename = os.path.basename(filepath)
        
        cleaned_filename = clean_filename(filename)
        new_filepath = os.path.join(dir_name, cleaned_filename) if dir_name else cleaned_filename
        
        with open(filepath, 'r', encoding='utf-8') as f:
            original_content = f.read()
            
        fixed_content, auto_fixes, manual_actions = process_file(filepath)
        
        has_content_changes = (fixed_content != original_content)
        renamed = (new_filepath != filepath)
        
        if has_content_changes or renamed:
            backup_path = filepath + ".bak"
            shutil.copyfile(filepath, backup_path)
            
            if renamed:
                with open(new_filepath, 'w', encoding='utf-8') as f:
                    f.write(fixed_content)
                os.remove(filepath)
                auto_fixes.append(f"Renamed file: `{filename}` -> `{cleaned_filename}`")
                report_filename = cleaned_filename
            else:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(fixed_content)
                report_filename = filename
        else:
            report_filename = filename
            
        if not auto_fixes and not manual_actions:
            print(f"✓ {report_filename} is clean.")
        else:
            print(f"## Lint report: {report_filename}\n")
            if auto_fixes:
                print("### Auto-fixed")
                for fix in auto_fixes:
                    print(f"- {fix}")
                print()
            if manual_actions:
                print("### Manual action required")
                for act in manual_actions:
                    print(f"- {act}")
                print()


if __name__ == '__main__':
    main()

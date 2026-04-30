import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { getCvData } from '@/app/[locale]/cv/cvData'
import en from '@/dictionaries/en'
import tr from '@/dictionaries/tr'

describe('getCvData', () => {
  it('returns all five data arrays', () => {
    const result = getCvData(en.cv)
    expect(result).toHaveProperty('careerItems')
    expect(result).toHaveProperty('educationItems')
    expect(result).toHaveProperty('volunteeringItems')
    expect(result).toHaveProperty('certificateItems')
    expect(result).toHaveProperty('competitionItems')
  })

  it('careerItems has at least the expected entries', () => {
    expect(getCvData(en.cv).careerItems.length).toBeGreaterThanOrEqual(4)
  })

  it('educationItems has at least the expected entries', () => {
    expect(getCvData(en.cv).educationItems.length).toBeGreaterThanOrEqual(3)
  })

  it('each career item has required fields', () => {
    const { careerItems } = getCvData(en.cv)
    for (const item of careerItems) {
      expect(item.icon).toBeDefined()
      expect(item.date).toBeTruthy()
      expect(item.title).toBeDefined()
      expect(item.description).toBeDefined()
    }
  })

  it('volunteeringItems passes through dictionary data unchanged', () => {
    const { volunteeringItems } = getCvData(en.cv)
    expect(volunteeringItems).toBe(en.cv.volunteering)
  })

  it('works with Turkish dictionary', () => {
    const result = getCvData(tr.cv)
    expect(result.careerItems.length).toBeGreaterThanOrEqual(4)
    expect(result.educationItems.length).toBeGreaterThanOrEqual(3)
  })
})

describe('renderParagraphs (via getCvData description)', () => {
  it('renders one <p> per description string', () => {
    const { careerItems } = getCvData(en.cv)
    const firstItem = careerItems[0]
    const { container } = render(<>{firstItem.description}</>)
    const paragraphs = container.querySelectorAll('p')
    expect(paragraphs.length).toBe(en.cv.career.odarama.description.length)
  })
})

describe('renderJobTitle (via getCvData career titles)', () => {
  it('renders an external link to the company', () => {
    const { careerItems } = getCvData(en.cv)
    render(<>{careerItems[0].title}</>)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(link.getAttribute('href')).toBeTruthy()
  })
})

describe('renderEduTitle (via getCvData education titles)', () => {
  it('renders a link to the institution and a subtitle span', () => {
    const { educationItems } = getCvData(en.cv)
    const { container } = render(<>{educationItems[0].title}</>)
    const links = container.querySelectorAll('a')
    expect(links.length).toBeGreaterThanOrEqual(1)
    expect(links[0]).toHaveAttribute('target', '_blank')
    const span = container.querySelector('span')
    expect(span).toBeInTheDocument()
  })
})

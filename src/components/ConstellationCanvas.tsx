'use client'

import { useEffect, useRef } from 'react'

const CONNECTION_DISTANCE = 150
const PARTICLE_COUNT = 100
const PARTICLE_SPEED = 0.3

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

export default function ConstellationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let particles: Particle[] = []
    let animFrameId: number

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      canvas!.width = width
      canvas!.height = height
    }

    function createParticle(): Particle {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * PARTICLE_SPEED,
        vy: (Math.random() - 0.5) * PARTICLE_SPEED,
        radius: Math.random() * 1.5 + 0.5,
      }
    }

    function init() {
      resize()
      particles = Array.from({ length: PARTICLE_COUNT }, createParticle)
    }

    function getColorRGB() {
      return document.documentElement.getAttribute('data-theme') === 'dark'
        ? '248, 250, 252'
        : '15, 23, 42'
    }

    function animate() {
      ctx!.clearRect(0, 0, width, height)
      const colorRGB = getColorRGB()

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1

        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${colorRGB}, 0.4)`
        ctx!.fill()
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < CONNECTION_DISTANCE) {
            const opacity = 1 - distance / CONNECTION_DISTANCE
            ctx!.beginPath()
            ctx!.moveTo(particles[i].x, particles[i].y)
            ctx!.lineTo(particles[j].x, particles[j].y)
            ctx!.strokeStyle = `rgba(${colorRGB}, ${opacity * 0.15})`
            ctx!.lineWidth = 0.5
            ctx!.stroke()
          }
        }
      }

      animFrameId = requestAnimationFrame(animate)
    }

    init()
    animate()
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(animFrameId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} id="bg-canvas" />
}
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// ponytail: single ambient decorative scene, plain three.js — no r3f abstraction for one canvas.
export function Hero3D() {
  const mount = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = mount.current
    if (!el) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, el.clientWidth / el.clientHeight, 0.1, 100)
    camera.position.set(0, 0, 9)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(el.clientWidth, el.clientHeight)
    el.appendChild(renderer.domElement)

    const group = new THREE.Group()
    scene.add(group)

    // Wireframe polyhedra floating like a loose ball of "events" — reads as sport/data, not brand noise.
    const geo = new THREE.IcosahedronGeometry(2.4, 1)
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.16 })
    const mesh = new THREE.Mesh(geo, mat)
    group.add(mesh)

    const accentGeo = new THREE.IcosahedronGeometry(2.4, 1)
    const accentMat = new THREE.MeshBasicMaterial({ color: 0xf1c40f, wireframe: true, transparent: true, opacity: 0.1 })
    const accentMesh = new THREE.Mesh(accentGeo, accentMat)
    accentMesh.scale.setScalar(1.18)
    group.add(accentMesh)

    // Scattered points for depth.
    const pointsGeo = new THREE.BufferGeometry()
    const count = 120
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2
    }
    pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const points = new THREE.Points(
      pointsGeo,
      new THREE.PointsMaterial({ color: 0xffffff, size: 0.045, transparent: true, opacity: 0.35 }),
    )
    scene.add(points)

    group.rotation.x = 0.3
    group.position.x = 3.2

    let frame = 0
    const clock = new THREE.Clock()

    const render = () => {
      const t = clock.getElapsedTime()
      group.rotation.y = t * 0.12
      points.rotation.y = -t * 0.03
      renderer.render(scene, camera)
    }

    render()
    if (!reduceMotion) {
      const tick = () => {
        render()
        frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }

    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(el.clientWidth, el.clientHeight)
      if (reduceMotion) render()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
      geo.dispose()
      mat.dispose()
      accentGeo.dispose()
      accentMat.dispose()
      pointsGeo.dispose()
      renderer.dispose()
      el.removeChild(renderer.domElement)
    }
  }, [])

  return <div className="hero-3d" ref={mount} aria-hidden="true" />
}

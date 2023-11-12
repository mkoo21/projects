import Image from 'next/image'
import Canvas from './canvas';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 box-border max-w-[100vw]">

      <div className="relative place-items-center box-content w-full">
        <Canvas />
      </div>

    </main>
  )
}

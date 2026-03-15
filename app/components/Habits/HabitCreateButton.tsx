"use client";

type Props = {
  onClick: () => void
}

export default function HabitCreateButton({ onClick }: Props) {
  const handleClick = () => {
    if (navigator.vibrate) {
      navigator.vibrate([10, 20, 10])
    }
    onClick()
  }

  return (
    <button
      onClick={handleClick}
      className="fixed 
                bottom-6 
                right-5 
                h-13 
                w-13 
                z-40
                rounded-2xl 
                bg-green-500 
                text-black 
                text-3xl 
                shadow-lg 
                flex 
                items-center 
                justify-center 
                active:scale-95 
                transition"
    >
      +
    </button>
  )
}
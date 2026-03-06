type Props = {
  onClick: () => void
}

export default function CreateHabitButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="fixed 
                bottom-6 
                right-6 
                h-13 
                w-13 
                z-50
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
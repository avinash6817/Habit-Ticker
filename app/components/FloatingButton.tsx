type Props = {
  onClick: () => void
}

export default function FloatingButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="fixed 
                bottom-6 
                right-6 
                w-16 
                h-16 
                z-50
                rounded-3xl 
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
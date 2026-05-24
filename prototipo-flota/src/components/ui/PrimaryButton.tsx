function PrimaryButton({

  children,

  onClick,

  disabled = false

}: {

  children: React.ReactNode,

  onClick: () => void,

  disabled?: boolean

}) {

  return (

    <button
      onClick={onClick}

      disabled={disabled}

      className={`
        px-4
        py-2
        rounded-xl
        font-semibold
        transition

        ${disabled
          ? `
            bg-slate-300
            cursor-not-allowed
          `
          : `
            bg-slate-900
            text-white
            hover:bg-slate-700
          `
        }
      `}
    >
      {children}
    </button>
  )
}

export default PrimaryButton
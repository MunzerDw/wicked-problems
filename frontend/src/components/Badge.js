function Badge({ text, color, className, ...props }) {
  return (
    <div
      {...props}
      className={`bg-${color} px-2 py-2 ${className} text-sm leading-3 rounded-full`}
    >
      {text}
    </div>
  )
}

export default Badge

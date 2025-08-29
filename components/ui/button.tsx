interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline'
  size?: 'default' | 'sm' | 'lg'
}

export function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors 
      ${variant === 'default' ? 'bg-gray-900 text-white hover:bg-gray-800' : 'border border-gray-300 hover:bg-gray-100'}
      ${size === 'default' ? 'h-10 px-4 py-2' : size === 'sm' ? 'h-8 px-3' : 'h-12 px-6'}
      ${className}`}
      {...props}
    />
  )
}
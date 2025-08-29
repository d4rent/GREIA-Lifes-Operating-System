interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline'
}

export function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 
      ${variant === 'default' ? 'border-transparent bg-gray-900 text-white' : 
        variant === 'secondary' ? 'border-transparent bg-gray-100 text-gray-900' :
        'border-gray-200 text-gray-900'} 
      ${className}`}
      {...props}
    />
  )
}
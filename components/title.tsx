
type TitleProps = {
  text: string
  textBox: string
}

export const Title = ({ text, textBox }: TitleProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="h-12 w-32 border rounded-lg flex items-center justify-center bg-sky-400 text-white">
        <span className="text-2xl font-bold">{textBox}</span>
      </div>
      <h2 className="text-2xl font-medium">{text}</h2>
    </div>
  )
}

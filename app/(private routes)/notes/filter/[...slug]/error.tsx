'use client'

type Props = {
  error: string
  value: string
}

const Error = ({ error, value }: Props) => {
  return (
    <div className="content">
      <p>
        Could not fetch {value}. {error}
      </p>
    </div>
  )
}

export default Error

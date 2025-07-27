

type LabelProp = {
    label:string
}

const Label = ({label}:LabelProp) => {
  return (
        <label htmlFor="Email" className='text-xl p-0.5 font-semibold text-blue-950 underline underline-offset-7 dark:text-blue-300'>{label}</label>
  )
}

export default Label
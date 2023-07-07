
const MESSAGES  = {
  FORMATTING_DISABLED: 'Automatic formatting is disabled', 
  CONFIG_NOT_RESOLVED: 'Unable to format the file. Missing Prettier config',
  FORMATTED: 'Formatted using %CONFIG%'
}

const FormattingStatus = () => {
  return (
    <div>Formatted using Intuita's custom config</div>
  )
}

export default FormattingStatus
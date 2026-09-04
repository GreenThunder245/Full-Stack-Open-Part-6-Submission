import useNotify from "../hooks/useNotify"

const Notification = () => {
   const { message } = useNotify()

  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  }

  if (message === null) return null

  return <div data-testid="notification" style={style}>{message}</div>
}

export default Notification

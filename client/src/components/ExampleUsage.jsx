import useAuthStore from '../store/authStore'

const ExampleUsage = () => {
  const { user, token, login, logout, loading } = useAuthStore()

  // דוגמה לשימוש בפונקציות
  const handleLogin = async () => {
    const result = await login({ 
      email: 'user@example.com', 
      password: 'password123' 
    })
    
    if (result.success) {
      console.log('Login successful!')
    } else {
      console.log('Login failed:', result.error)
    }
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <div>
      {user ? (
        <div>
          <p>שלום {user.name}!</p>
          <button onClick={handleLogout}>התנתק</button>
        </div>
      ) : (
        <div>
          <p>אתה לא מחובר</p>
          <button onClick={handleLogin}>התחבר</button>
        </div>
      )}
    </div>
  )
}

export default ExampleUsage

import { useState, useEffect, useCallback, useRef } from 'react'
import './App.css'

function CounterCard() {
  const [count, setCount] = useState(0)
  const [incrementValue, setIncrementValue] = useState(1)
  const [minLimit, setMinLimit] = useState(0)
  const [maxLimit, setMaxLimit] = useState(100)

  // Optimized handlers with useCallback
  const handleIncrement = useCallback(() => {
    if (count < maxLimit) {
      setCount(prev => prev + Number(incrementValue) || 1)
    }
  }, [count, maxLimit, incrementValue])

  const handleDecrement = useCallback(() => {
    if (count > minLimit) {
      setCount(prev => prev - Number(incrementValue) || 1)
    }
  }, [count, minLimit, incrementValue])

  const handleReset = useCallback(() => {
    setCount(0)
  }, [])

  // Advanced useEffect for side effects
  useEffect(() => {
    document.title = `Advanced Counter: ${count}`
    console.log(`Counter updated to: ${count} (Increment: ${incrementValue})`)
  }, [count, incrementValue])

  return (
    <div className="card" role="region" aria-label="Advanced Counter">
      <h2>🧠 Advanced Counter</h2>
      <div className="counter-display" aria-live="polite">
        {count}
      </div>
      
      <div className="counter-input-group">
        <label htmlFor="increment-value">Increment Value:</label>
        <input
          id="increment-value"
          className="counter-input"
          type="number"
          min="1"
          max="10"
          value={incrementValue}
          onChange={(e) => setIncrementValue(Math.max(1, parseInt(e.target.value) || 1))}
          aria-describedby="increment-help"
          placeholder="1-10"
        />
        <small id="increment-help">Custom step (1-10)</small>
      </div>

      <div className="counter-controls">
        <button
          className="btn btn-primary"
          onClick={handleIncrement}
          disabled={count >= maxLimit}
          aria-label={`Increment by ${incrementValue}, current: ${count}`}
        >
          ➕
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleDecrement}
          disabled={count <= minLimit}
          aria-label={`Decrement by ${incrementValue}, current: ${count}`}
        >
          ➖
        </button>
        <button
          className="btn btn-reset"
          onClick={handleReset}
          aria-label="Reset counter to 0"
        >
          🔄
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.95rem', opacity: 0.8 }}>
        Limits: {minLimit} - {maxLimit} | Optimized with useCallback & useEffect
      </div>
    </div>
  )
}

function FormCard() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const timeoutRef = useRef(null)

  const validate = useCallback((data) => {
    const newErrors = {}

    if (!data.name || data.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Valid email required'
    }

    if (!data.message || data.message.trim().length === 0) {
      newErrors.message = 'Message is required'
    }

    return newErrors
  }, [])

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Real-time validation
    const fieldErrors = validate({ ...formData, [name]: value })
    if (fieldErrors[name]) {
      setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }))
    } else {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }, [formData, validate])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    const validationErrors = validate(formData)
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsLoading(true)
    setErrors({})

    // Simulate API call (2s delay)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Log form data to console like counter
    console.log('✅ Form Submitted Successfully:', {
      name: formData.name,
      email: formData.email,
      message: formData.message
    })
    
    setIsLoading(false)
    setIsSubmitted(true)

    // Auto reset after 3s
    timeoutRef.current = setTimeout(() => {
      setFormData({ name: '', email: '', message: '' })
      setIsSubmitted(false)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }, 3000)
  }, [formData, validate])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div className="card" role="region" aria-label="Advanced Form">
      <h2>📝 Advanced Form</h2>
      
      <form onSubmit={handleSubmit} noValidate aria-describedby={isSubmitted ? 'form-success' : undefined}>
        <div className="form-group">
          <label className="form-label" htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            className={`form-input ${errors.name ? 'error' : ''}`}
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            disabled={isLoading}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            required
          />
          {errors.name && (
            <div id="name-error" className="error-message" role="alert">
              {errors.name}
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            className={`form-input ${errors.email ? 'error' : ''}`}
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            disabled={isLoading}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            required
          />
          {errors.email && (
            <div id="email-error" className="error-message" role="alert">
              {errors.email}
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            className={`form-input form-textarea ${errors.message ? 'error' : ''}`}
            value={formData.message}
            onChange={handleChange}
            placeholder="Your message here..."
            disabled={isLoading}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'message-error' : undefined}
            required
          />
          {errors.message && (
            <div id="message-error" className="error-message" role="alert">
              {errors.message}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
          aria-label={isLoading ? 'Submitting...' : 'Submit form'}
        >
          {isLoading ? (
            <span className="loading">
              <div className="spinner"></div>
              Submitting...
            </span>
          ) : (
            '🚀 Submit Form'
          )}
        </button>
      </form>

      {isSubmitted && (
        <div id="form-success" className="success-message" role="alert" aria-live="assertive">
          ✅ Form submitted successfully! Auto-resetting in 3 seconds...
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.95rem', opacity: 0.8 }}>
        Real-time validation • Simulated API • Controlled components
      </div>
    </div>
  )
}

function App() {
  return (
    <>
      <header className="app-header">
        <h1>🚀 Advanced React Toolkit</h1>

      </header>

      <main className="app-container">
        <div className="cards-grid">
          <CounterCard />
          <FormCard />
        </div>
      </main>

      <footer style={{ textAlign: 'center', padding: '2rem', opacity: 0.6, fontSize: '0.875rem' }}>
         M.Muzammil - Advanced React Toolkit | 2025
      </footer>
    </>
  )
}

export default App


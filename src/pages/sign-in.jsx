import { useState } from 'react';
import { Input, Checkbox, Button, Typography } from '@material-tailwind/react';
import { Link, useNavigate } from 'react-router-dom';

export function SignIn() {
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // For handling error messages
  const [success, setSuccess] = useState(null); // For success message
  const navigate = useNavigate(); // For navigation after login success

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('https://node-auth-jwt-api-rest-tsc-production.up.railway.app/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If response is not okay, display error message
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      // Save the token in localStorage or cookies (optional)
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.id);

      // Set success message
      setSuccess('Login exitoso');
      setError(null);

      // Navigate to a different page after successful login (e.g., home page)
      navigate('/profile');
    } catch (err) {
      setError(err.message);
      setSuccess(null);
    }
  };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-10">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">
            Sign In
          </Typography>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="text-lg font-normal"
          >
            Enter your email and password to Sign In.
          </Typography>
        </div>
        <form
          className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2"
          onSubmit={handleSubmit}
        >
          <div className="mb-1 flex flex-col gap-6">
            <Typography
              variant="small"
              color="blue-gray"
              className="-mb-7 font-medium"
            >
              Your email
            </Typography>
            <Input
              type="email" // Ensure email validation
              size="lg"
              placeholder="name@mail.com"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update email state
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
            />
          </div>
          <div className="mb-1 flex flex-col gap-2">
            <Typography
              variant="small"
              color="blue-gray"
              className="-mb-3 font-medium"
            >
              Your password
            </Typography>

            <div className="flex items-center">
              {' '}
              {/* Use flex to align the button and input */}
              <Input
                size="lg"
                type={showPassword ? 'text' : 'password'} // Set type based on state
                placeholder="Password"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 pr-10" // Adjust padding for button space
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Update password state
                labelProps={{
                  className: 'before:content-none after:content-none',
                }}
              />
              <Button
                variant="text"
                color="blue-gray"
                onClick={togglePasswordVisibility}
                className="ml-2 text-xs font-medium" // Add margin-left for spacing
                type="button" // Prevents the button from submitting the form
              >
                {showPassword ? 'Hide' : 'Show'} {/* Toggle button text */}
              </Button>
            </div>
          </div>
          <Checkbox
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center justify-start font-medium"
              >
                I agree the&nbsp;
                <a
                  href="#"
                  className="font-normal text-black transition-colors hover:text-gray-900 underline"
                >
                  Terms and Conditions
                </a>
              </Typography>
            }
            containerProps={{ className: '-ml-2.5' }}
          />
          {error && (
            <Typography color="red" variant="small">
              {error}
            </Typography>
          )}{' '}
          {/* Display error */}
          {success && (
            <Typography color="green" variant="small">
              {success}
            </Typography>
          )}{' '}
          {/* Display success */}
          <Button className="mt-6" fullWidth type="submit">
            Sign In
          </Button>
          <div className="flex items-center justify-between gap-2 mt-6">
            <Checkbox
              label={
                <Typography
                  variant="small"
                  color="gray"
                  className="flex items-center justify-start font-medium"
                >
                  Subscribe me to newsletter
                </Typography>
              }
              containerProps={{ className: '-ml-2.5' }}
            />
            <Typography variant="small" className="font-medium text-gray-900">
              <a href="#">Forgot Password</a>
            </Typography>
          </div>
          <Typography
            variant="paragraph"
            className="text-center text-blue-gray-500 font-medium mt-4"
          >
            Not registered?
            <Link to="/sign-up" className="text-gray-900 ml-1">
              Create account
            </Link>
          </Typography>
        </form>
      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>
    </section>
  );
}

export default SignIn;

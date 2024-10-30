import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../lib/features/users/userSlices';
import { RootState } from '../../../lib/store';

const Register = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.user);

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    const userData = {
      name: event.currentTarget.name.value,
      email: event.currentTarget.email.value,
      password: event.currentTarget.password.value,
    };
    await dispatch(registerUser(userData));
  };

  return (
    <form onSubmit={handleRegister}>
      <input type="text" name="name" placeholder="Name" required />
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit" disabled={loading}>
        Register
      </button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default Register;

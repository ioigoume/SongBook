import {useState, useContext} from "react";
import "../../app.css";
import {Link, useNavigate} from "react-router-dom";
import {useForm} from 'react-hook-form';
import {useMutation} from 'react-query';
import {toast} from 'react-toastify';
import {loginUser} from "../../utils/queryKeys";
import {client} from '../../utils/api';
import {UserContext} from "../../Context/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const {currentUser, setCurrentUser} = useContext(UserContext);

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const onChange = (e) => {
    setValues({...values, [e.target.name]: e.target.value});
  };

  // FORM
  const {register, handleSubmit, reset, formState: {errors}} = useForm();

  async function postForm(data) {
    const {email, password} = data

    return await client.post(loginUser, {
      email: email,
      password: password
    })
  }

  const {mutateAsync: sendData} = useMutation(postForm);

  const notifyError = () => toast.error("Login Failed.")

  const onSubmit = async (data, e) => {
    try {
      const response = await sendData(data)
      reset()
      setCurrentUser(response.config.data)
      console.dir(response.config.data)
      navigate("/songs");
      // Check data and redirect to songs view
    } catch (err) {
      notifyError()
      console.log(err.message)
      reset()
      // throw new Error(err)
    }
  }

  // ELEMENT
  return (
    <div className="app">
      <form method="post" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="reg-log">Login</h1>

        {/* Email */}
        <div key="register-email-3" className="formInput">
          <label>Email</label>
          <input
            id="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                message: "Email is invalid"
              }
            })}
            type="text"
            placeholder="Email"
            value={values.email ?? ""}
            onChange={onChange}
          />
          <span className="error">{errors.email?.message}</span>
        </div>

        {/* PASSWORD */}
        <div key="register-password-3" className="formInput">
          <label>Password</label>
          <input
            id="password"
            {...register("password", {
              required: "Password is required"
            })}
            type="password"
            placeholder="Password"
            value={values.password ?? ""}
            onChange={onChange}
          />
          <span className="error">{errors.password?.message}</span>
        </div>


        <button className="reg-form" type="submit">Login</button>
        <div className="reg-link">
          <Link to={'/register'}>Register</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;

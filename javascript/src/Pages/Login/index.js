import {useState} from "react";
import "../../app.css";
import {Link} from "react-router-dom";
import {useForm} from 'react-hook-form';
import {useMutation} from 'react-query';
import {toast} from 'react-toastify';
import {loginUser} from "../../utils/queryKeys";
import {client} from '../../utils/api';

const Login = () => {
    // STATE
    const [values, setValues] = useState({
        email: "",
        password: "",
    });

    const onChange = (e) => {
        setValues({...values, [e.target.name]: e.target.value});
    };

    // FORM
    const {register, handleSubmit, reset, setError, formState: {errors}} = useForm();

    async function postForm(data) {
        const {email, password} = data

        return await client.post(loginUser, {
            email: email,
            password: password
        })
    }

    const {isLoading, mutateAsync: sendData} = useMutation(postForm);

    const notifyError = () => toast.error("Update contact failed.")

    const onSubmit = async (data, e) => {
        try {
            await sendData(data)
            reset()
            e.target.reset()
        } catch (err) {
            notifyError()
            throw new Error(err)
        }
    }

    const inputs = [
        {
            id: 1,
            name: "email",
            type: "email",
            placeholder: "Email",
            required: true,
            label: "Email",
        },
        {
            id: 2,
            name: "password",
            type: "password",
            placeholder: "Password",
            label: "Password",
            required: true
        },
    ];

    // ELEMENT
    return (
        <div className="app">
            <form method="post" onSubmit={handleSubmit(onSubmit)}>
                <h1 className="reg-log">Login</h1>
                {inputs.map((input) => (
                    <div key={input.id} className="formInput">
                        <label>{input.label}</label>
                        <input
                            id={input.name}
                            {...register(input.name, {
                                required: input.required,
                                message: input.message ?? ""
                            })}
                            type={input.type}
                            placeholder={input.placeholder}
                            value={values[input.name] ?? ""}
                            onChange={onChange}
                        />
                        <span>{input.errorMessage ?? ""}</span>
                    </div>
                ))}
                <button className="reg-form" type={"submit"}>Login</button>
                <div className="reg-link">
                    <Link to={'/register'}>Register</Link>
                </div>
            </form>
        </div>
    );
};

export default Login;
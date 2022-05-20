import {useState} from "react";
import "../../app.css";
import FormInput from "../../components/FormInput";

const Register = () => {
    const [values, setValues] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
    });

    const inputs = [
        {
            id: 1,
            name: "first_name",
            type: "text",
            placeholder: "Fist Name",
            errorMessage:
                "Name should be 3-16 characters and shouldn't include any special character!",
            label: "Name",
            pattern: "^[A-Za-z0-9]{3,16}$",
            required: true,
        },
        {
            id: 2,
            name: "last_name",
            type: "text",
            placeholder: "Last Name",
            errorMessage:
                "Last Name should be 3-16 characters and shouldn't include any special character!",
            label: "Last Name",
            pattern: "^[A-Za-z0-9]{3,16}$",
            required: true,
        },
        {
            id: 3,
            name: "email",
            type: "email",
            placeholder: "Email",
            errorMessage: "It should be a valid email address!",
            label: "Email",
            required: true,
        },
        {
            id: 4,
            name: "password",
            type: "password",
            placeholder: "Password",
            errorMessage:
                "Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!",
            label: "Password",
            pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
            required: true,
        },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const onChange = (e) => {
        setValues({...values, [e.target.name]: e.target.value});
    };

    return (
        <div className="app">
            <form onSubmit={handleSubmit}>
                <h1>Register</h1>
                {inputs.map((input) => (
                    <FormInput
                        key={input.id}
                        {...input}
                        value={values[input.name]}
                        onChange={onChange}
                    />
                ))}
                <button type={"submit"}>Submit</button>
            </form>
        </div>
    );
};

export default Register;

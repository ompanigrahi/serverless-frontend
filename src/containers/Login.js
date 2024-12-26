import React, { useState } from "react";
import { Auth} from "aws-amplify"; // Import API for calling notes-app-uploads
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import { LinkContainer } from "react-router-bootstrap";
import "./Login.css";
import { useHistory } from "react-router-dom";

export default function Login() {
    const history = useHistory();
    const { userHasAuthenticated } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);
    const [fields, handleFieldChange] = useFormFields({
        email: "",
        password: "",
    });

    function validateForm() {
        return fields.email.length > 0 && fields.password.length > 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setIsLoading(true);
        try {
            // Sign in the user
            await Auth.signIn(fields.email, fields.password);
            
            // Example: Fetch user-specific data from notes-app-uploads API
           // const userNotes = await API.get("notes-app-uploads", "/notes-app-uploads");
            //console.log("User notes:", userNotes);

            // Mark user as authenticated
            userHasAuthenticated(true);
            history.push("/"); // Redirect to home page after successful login
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }

    return (
        <div className="Login">
            <h2 className="text-center">Login</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group size="lg" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        autoFocus
                        type="email"
                        value={fields.email}
                        onChange={handleFieldChange}
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={fields.password}
                        onChange={handleFieldChange}
                    />
                </Form.Group>

                <LinkContainer to="/forget">
                    <h6 className="forgetPassword">
                        <span>Forget Password?</span>
                    </h6>
                </LinkContainer>
                <LoaderButton
                    block
                    size="lg"
                    type="submit"
                    isLoading={isLoading}
                    disabled={!validateForm()}
                >
                    Login
                </LoaderButton>
            </Form>
        </div>
    );
}

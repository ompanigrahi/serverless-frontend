import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import { Auth } from "aws-amplify";
import { BsPencilSquare } from "react-icons/bs";
import { LinkContainer } from "react-router-bootstrap";
import { API } from "aws-amplify";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./Home.css";

export default function Home() {
    const [notes, setNotes] = useState([]);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [greet, setGreet] = useState();
    const { isAuthenticated } = useAppContext();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function onLoad() {
            if (!isAuthenticated) {
                return;
            }
            try {
                const notes = await loadNotes();
                const user = await Auth.currentAuthenticatedUser();
                const { attributes } = user;
                setGreet(attributes.email);
                setNotes(notes);
                setFilteredNotes(notes);
            } catch (e) {
                onError(e);
            }
            setIsLoading(false);
        }
        onLoad();
    }, [isAuthenticated]);

    async function loadNotes() {
        return await API.get("notes", "/notes-app-uploads");
    }

    async function handleDeleteAll() {
        const confirmed = window.confirm(
            "Are you sure you want to delete all your notes? This action cannot be undone."
        );

        if (!confirmed) return;

        try {
            await API.del("notes", "/notes-app-uploads");
            setNotes([]);
            setFilteredNotes([]);
            alert("All notes have been deleted.");
        } catch (e) {
            onError(e);
        }
    }

    function handleSearch(event) {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);
        setFilteredNotes(
            notes.filter((note) =>
                note.content.toLowerCase().includes(term) ||
                (note.attachment && note.attachment.toLowerCase().includes(term))
            )
        );
    }

    const BASE_URL = "https://om-note-app-upload.s3.us-east-1.amazonaws.com";

    function renderNotesList(notes) {
        return (
            <>
                
                <div className="notes-container">
                    {notes.map(({ noteId, content, createdAt, attachment, userId }) => {
                        const safeContent = typeof content === "string" ? content : "No content available";
                        const safeAttachment = typeof attachment === "string" ? attachment : null;

                        const filePath = `private/${userId}/${safeAttachment}`;
                        const encodedKey = encodeURIComponent(filePath);
                        const imageUrl = `${BASE_URL}/${encodedKey}`;

                        return (
                            <LinkContainer key={noteId} to={`/notes-app-uploads/${noteId}`} style={{ textDecoration: 'none' }}>
                                <div className="note-card">
                                    {imageUrl && (
                                        <img
                                            src={imageUrl}
                                            alt={`Note ${content.trim().split("\n")[0] || "Image"}`}
                                            className="note-image"
                                            onError={(e) => (e.target.src = "/default-image.png")}
                                        />
                                    )}
                                    <h3>{content.trim().split("\n")[0]}</h3>
                                </div>
                            </LinkContainer>
                        );
                    })}
                </div>
            </>
        );
    }




    function renderLander() {
        return (
            <div className="lander">
                <h1>Scribbled</h1>
                <p className="text-muted">A digital note-taking app</p>
                <div className="box">
                    <LinkContainer to="/signup">
                        <Button variant="success">Sign up</Button>
                    </LinkContainer>
                    <LinkContainer to="/login">
                        <Button className="ml-4" variant="primary">Login</Button>
                    </LinkContainer>
                </div>
            </div>
        );
    }

    function renderNotes() {
        return (
            <div className="notes">
                <h2>
                    Welcome, <span>{greet}</span>
                </h2>
                <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Notes</h2>
                <div className="search-create-delete-container">
                    <Form.Control
                        type="text"
                        placeholder="Search notes..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <LinkContainer to="/notes-app-uploads/new">
                        <Button variant="success" className="create-note-button">
                            <BsPencilSquare size={17} />
                            <span className="ml-2 font-weight-bold">Create a new note</span>
                        </Button>
                    </LinkContainer>
                    <Button
                        variant="danger"
                        className="delete-all-button"
                        onClick={handleDeleteAll}
                    >
                        Delete All Notes
                    </Button>
                </div>
                {!isLoading ? (
                    <ListGroup>{renderNotesList(filteredNotes)}</ListGroup>
                ) : (
                    <p>Loading notes...</p>
                )}
            </div>
        );
    }


    return (
        <div className="Home">
            {isAuthenticated ? renderNotes() : renderLander()}
        </div>
    );
}

import { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Container,
  AppBar,
  Toolbar,
  CircularProgress,
  Avatar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (input.trim() === "" || isLoading) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/queryllm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botMessage = {
        sender: "bot",
        text: data.answer || "No response from bot.",
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching data:", error);
      const errorMessage = {
        sender: "bot",
        text: "Sorry, something went wrong.",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "#f5f5f5",
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <SmartToyIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AI Classroom Copilot
          </Typography>
        </Toolbar>
      </AppBar>
      <Container
        maxWidth="md"
        sx={{ flexGrow: 1, py: 3, display: "flex", flexDirection: "column" }}
      >
        <Paper
          elevation={3}
          sx={{
            flexGrow: 1,
            p: 2,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            bgcolor: "#ffffff",
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent:
                    msg.sender === "user" ? "flex-end" : "flex-start",
                  mb: 2,
                }}
              >
                {msg.sender === "bot" && (
                  <Avatar sx={{ bgcolor: "secondary.main", mr: 1.5 }}>
                    <SmartToyIcon />
                  </Avatar>
                )}
                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    bgcolor:
                      msg.sender === "user" ? "primary.main" : "grey.200",
                    color:
                      msg.sender === "user" ? "primary.contrastText" : "black",
                    borderRadius:
                      msg.sender === "user"
                        ? "20px 20px 5px 20px"
                        : "20px 20px 20px 5px",
                    maxWidth: "70%",
                  }}
                >
                  <Typography variant="body1">{msg.text}</Typography>
                </Paper>
                {msg.sender === "user" && (
                  <Avatar sx={{ bgcolor: "primary.main", ml: 1.5 }}>
                    <PersonIcon />
                  </Avatar>
                )}
              </Box>
            ))}
            {isLoading && (
              <Box
                sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}
              >
                <Avatar sx={{ bgcolor: "secondary.main", mr: 1.5 }}>
                  <SmartToyIcon />
                </Avatar>
                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    bgcolor: "grey.200",
                    borderRadius: "20px 20px 20px 5px",
                  }}
                >
                  <CircularProgress size={24} />
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>
        </Paper>
        <Box
          sx={{
            p: 2,
            bgcolor: "background.paper",
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            sx={{ mb: 1 }}
          />
          <Button
            fullWidth
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleSend}
            disabled={isLoading}
          >
            Send
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default App;

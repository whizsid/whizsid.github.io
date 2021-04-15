import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import React from "react";
import FileBrowser from "./FileBrowser";

export default function App() {
    return (
        <Container maxWidth="sm">
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    File Browser
                </Typography>
                <FileBrowser
                    paths={[
                        "abc/def",
                        "abc/ghi/jkl",
                        "abc/ghi/yz/",
                        "pqr",
                        "abc/ghi/mno",
                        "stu/vwx",
                    ]}
                />
            </Box>
        </Container>
    );
}

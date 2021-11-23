import Facebook from "@mui/icons-material/Facebook";
import GitHub from "@mui/icons-material/GitHub";
import LinkedIn from "@mui/icons-material/LinkedIn";
import Mail from "@mui/icons-material/Mail";
import MyLocation from "@mui/icons-material/MyLocation";
import Telegram from "@mui/icons-material/Telegram";
import Twitter from "@mui/icons-material/Twitter";
import WhatsApp from "@mui/icons-material/WhatsApp";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";
import { Theme } from "@mui/material/styles";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import {FC} from "react";

const useStyles = makeStyles((theme: Theme) => ({
    header: {
        background: "#759b91",
        padding: theme.spacing(1),
        color: theme.palette.common.white,
    },
    map: {
        height: 400,
        width: "100%",
        [theme.breakpoints.down("lg")]: {
            width: "100vw",
        },
    },
    popup: {
        textAlign: "center",
    },
}));

const ContactSection: FC = () => {
    const classes = useStyles();

    return (
        <div>
            <Typography className={classes.header} variant="h6">
                {" "}
                Contact{" "}
            </Typography>
            <Grid container={true}>
                <Grid item={true} md={4}>
                    <MapContainer
                        className={classes.map}
                        center={[6.4373783, 80.1889149]}
                        zoom={13}
                    >
                        <TileLayer
                            attribution={
                                '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            }
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[6.4373783, 80.1889149]}>
                            <Popup>
                                <div className={classes.popup}>
                                    <img
                                        width="64"
                                        src="avatar.png"
                                        alt="Ramesh Kithsiri With Sunglasses"
                                    />
                                    <Typography variant="body1">
                                        Ramesh Kithsiri
                                    </Typography>
                                </div>
                            </Popup>
                        </Marker>
                    </MapContainer>
                </Grid>
                <Grid item={true} md={8}>
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <MyLocation />
                            </ListItemIcon>
                            <ListItemText primary="Meegahathanna, Sri Lanka" />
                        </ListItem>
                        <ListItem
                            button={true}
                            component="a"
                            href="mailto:whizsid@aol.com"
                        >
                            <ListItemIcon>
                                <Mail />
                            </ListItemIcon>
                            <ListItemText primary="whizsid@aol.com" />
                        </ListItem>

                        <ListItem
                            button={true}
                            component="a"
                            href="https://m.me/Prince.Of.SL"
                        >
                            <ListItemIcon>
                                <Facebook />
                            </ListItemIcon>
                            <ListItemText primary="Prince.Of.SL" />
                        </ListItem>
                        <ListItem
                            button={true}
                            component="a"
                            href="https://www.linkedin.com/in/ramesh-kithsiri-327414170/"
                        >
                            <ListItemIcon>
                                <LinkedIn />
                            </ListItemIcon>
                            <ListItemText primary="Ramesh Kithsiri" />
                        </ListItem>
                        <ListItem
                            button={true}
                            component="a"
                            href="https://twitter.com/whiz_sid"
                        >
                            <ListItemIcon>
                                <Twitter />
                            </ListItemIcon>
                            <ListItemText primary="whiz_sid" />
                        </ListItem>
                        <ListItem
                            button={true}
                            component="a"
                            href="whatsapp://send?phone=+94758732973&text=Hy%20Ramesh"
                        >
                            <ListItemIcon>
                                <WhatsApp />
                            </ListItemIcon>
                            <ListItemText primary="+94758732973" />
                        </ListItem>
                        <ListItem
                            button={true}
                            component="a"
                            href="https://t.me/whizsid"
                        >
                            <ListItemIcon>
                                <Telegram />
                            </ListItemIcon>
                            <ListItemText primary="whizsid" />
                        </ListItem>
                        <ListItem
                            button={true}
                            component="a"
                            href="https://github.com/whizsid"
                        >
                            <ListItemIcon>
                                <GitHub />
                            </ListItemIcon>
                            <ListItemText primary="whizsid" />
                        </ListItem>
                    </List>
                </Grid>
            </Grid>
        </div>
    );
};

export default ContactSection;

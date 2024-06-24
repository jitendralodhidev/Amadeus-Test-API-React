// Importing service
import Flight from "./flight";
import Login from "./login";
import Hotel from "./hotel"
import Travel from "./travel";

const WebAppAPI = {
    Flight: new Flight,
    Hotel: new Hotel,
    Login: new Login,
    Travel: new Travel
}

export default WebAppAPI;
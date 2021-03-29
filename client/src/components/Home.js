import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div>
            <p>Hi there, our current paths are ...</p>
            <ul>
                <li>
                    <Link to="/api/can_server/raw"> Raw </Link>
                </li>
                <li>
                    <Link to="/api/can_server/converted"> Converted </Link>
                </li>
            </ul>
        </div>
    )
}
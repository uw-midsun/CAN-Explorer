import React, {useEffect, useState} from "react";

export default function CanMessagePage() {
    const [canData, setCanData] = useState();

    useEffect(() => {
        fetch("http://localhost:8000/api/can_server", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((res) => res.json())
        .then((res) => setCanData(res[0].title))
        .catch((err) => console.log(err));
    }, []);

    return (
        <div>
            <p>
                {canData}
            </p>
        </div>
    );
}
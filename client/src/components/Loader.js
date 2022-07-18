import React, { useState, useEffect } from "react";

function Loader(props) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        console.log(progress);
    });

    return (
        <div>
            ...
        </div>
    );
}

export default Loader;
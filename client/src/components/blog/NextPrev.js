

export default function NextPrev({ next, prev }) {

    let nextComp = <div></div>;
    if (next) {
        nextComp = (
            <a className="nextprev__item" href={`/blogs/${next.link}`}>
                <h2>Next &#8611;</h2>
                <h3>{next.title}</h3>
            </a>
        )
    }

    let prevComp = <div></div>;
    if (prev) {
        prevComp = (
            <a className="nextprev__item" href={`/blogs/${prev.link}`}>
                 <h2>&#8610; Previous</h2>
                 <h3>{prev.title}</h3>
            </a>
        )
    }

    return (
        <div className="nextprev">
            {prevComp}
            {nextComp}
        </div>
    )

}
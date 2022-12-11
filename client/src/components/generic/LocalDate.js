

export default function LocalDate({ date }) {

    const dateString = new Date(date).toLocaleDateString();

    return (
        <span className="date">
            <span>&#9760;</span>{dateString}
        </span>
    )

}
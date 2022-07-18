

export default function Tag({ children }) {

    return (
        <a href={`/tags/${children}`} className="tag">
            {children}
        </a>
    )

}
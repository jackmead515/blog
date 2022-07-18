

export default function SectionHeader({ children }) {
    return (
        <div className="sheader">
            <div className="sheader__border"></div>
            <h2>{children}</h2>
            <div className="sheader__border"></div>
        </div>
    );
}
import icon from '../../assets/icon.png'

const Logo = ({ className }: { className: string }) => {
    return (
        <div className={className}>
            <img src={icon} alt="Examify" width={64} height={64}/>
        </div>
    )
}

export default Logo
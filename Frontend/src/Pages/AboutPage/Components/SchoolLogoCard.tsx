const SchoolLogoCard = ({ schoolName, logo }: { schoolName: string, logo: string }) => {
    return (
        <div>
            <img src={logo} alt={schoolName} style={{
                width: "100px",
                aspectRatio: "1/1"
            }}/>
        </div>
    )
}

export default SchoolLogoCard;
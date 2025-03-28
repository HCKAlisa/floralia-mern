const SocialsInput = () => {
    return (
        <div>
            <select name="socials-select" id="socials-select" className="block p-4 w-3/5 text-2xl rounded-sm text-blue-950 bg-blue-100 placeholder:text-blue-700 focus:outline-2 focus:outline-blue-400" defaultValue="Discord">
                <option value="discord">Discord</option>
                <option value="instagram">Instagram</option>
                <option value="x">X (former Twitter)</option>
            </select>
        </div>
    )
}
export default SocialsInput

function Mensaje ({msg,visible}){
    return visible 
    ?   <div className="mt-4 text-sm text-red-500">
            {msg}
        </div>
    : null
}

export default Mensaje
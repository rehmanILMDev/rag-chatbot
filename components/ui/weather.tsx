export  function Weather({ city, unit } : any) {

    return (
      <div>
        <div>{city}</div>
        <div>{unit}</div>
        <div>{"data"}</div>
      </div>
    );
  }
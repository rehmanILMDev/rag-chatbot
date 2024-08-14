export  function Stock({ symbol, numOfMonths } : any) {

    return (
      <div>
        <div>{symbol}</div>
        <div>{numOfMonths}</div>
        <div>{"data"}</div>
      </div>
    );
  }
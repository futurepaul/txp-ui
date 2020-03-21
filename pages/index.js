import { useState, useReducer } from "react";
import Head from "next/head";

import { txp_demo } from "txp";

const VersionDesc = () => (
  <>
    <p>
      The version number is four bytes long and is expressed as a hexadecimal
      value in little endian format.
    </p>
    <p>
      There are two version types. Version 01 indicates that there is no
      relative time lock. Version 02 indicates that there may be a relative time
      lock. Version 02 was introduced in BIP0068 which added
      OP_CHECKSEQUENCEVERIFY along with BIP0112 which upgraded it. Version 02 is
      used in conjunction with the sequence number which is described below.
    </p>
  </>
);

const InputNumDesc = () => (
  <>
    <p>
      The next one to nine bytes in the transaction input defines the number of
      included outpoints and is of type VarInt. There is always one outpoint for
      each UTXO being consumed.
    </p>
  </>
);

const InputDesc = () => (
  <>
    <p>
      Each transaction input points to a previous transactions output. If the
      unlocking script in the current transaction input meets the conditions set
      by the output script of the previous transaction, then the UTXO that the
      previous transaction “holds” can be spent.
    </p>
  </>
);

const OutputNumDesc = () => (
  <>
    <p>
      The first byte in the transaction output defines the number of outputs and
      is of type VarInt.
    </p>
  </>
);

const OutputDesc = () => (
  <>
    <p>
      The transaction output contains the output scripts and the amount that
      those scripts control. Most often, the transaction has more than one
      output. In a typical P2PKH a transaction has an output containing the
      spend output and the change output. Each output contains the amount, in
      satoshis, being consumed and the conditions that must be met in order to
      spend them.
    </p>
  </>
);

const LocktimeDesc = () => (
  <>
    <p>
      nLockTime allows for the use of absolute time locks. It is four bytes long
      and is expressed as a hexadecimal value in little endian format. Absolute
      time locks enables the user to submit a transaction to the network that
      will remain invalid until a specified time has passed. nLockTime is
      essentially a target in time for the transaction to be confirmed and is
      specified via block number or epoch time.
    </p>
  </>
);

const initialState = {
  pieces: [
    {
      kind: "version",
      expanded: false,
      value: "01000000",
      prettyName: "Version"
    },
    {
      kind: "in_num_of",
      expanded: false,
      value: "01",
      prettyName: "Number of TxIns"
    },
    {
      kind: "ins",
      expanded: false,
      value:
        "813f79011acb80925dfe69b3def355fe914bd1d96a3f5f71bf8303c6a989c7d1000000006b483045022100ed81ff192e75a3fd2304004dcadb746fa5e24c5031ccfcf21320b0277457c98f02207a986d955c6e0cb35d446a89d3f56100f4d7f67801c31967743a9c8e10615bed01210349fc4e631e3624a545de3f89f5d8684c7b8138bd94bdd531d2e213bf016b278afeffffff",
      prettyName: "TxIns"
    },
    {
      kind: "out_num_of",
      expanded: false,
      value: "02",
      prettyName: "Number of TxOuts"
    },
    {
      kind: "outs",
      expanded: false,
      value:
        "a135ef01000000001976a914bc3b654dca7e56b04dca18f2566cdaf02e8d9ada88ac99c39800000000001976a9141c4bc762dd5423e332166702cb75f40df79fea1288ac",
      prettyName: "TxOuts"
    },
    {
      kind: "locktime",
      expanded: false,
      value: "19430600",
      prettyName: "Locktime"
    }
  ]
};

function updateObjectInArray(array, action) {
  return array.map((item, index) => {
    if (index !== action.index) {
      // This isn't the item we care about - keep it as-is
      return item;
    }
    // Otherwise, this is the one we want - return an updated value
    return {
      ...item,
      ...action.item
    };
  });
}

function reducer(state, action) {
  switch (action.type) {
    case "toggle_expand":
      console.log(state);
      console.log(action);
      let piece = state.pieces[action.payload.index];
      console.log(piece);
      piece.expanded = !piece.expanded;
      return {
        pieces: updateObjectInArray(state.pieces, {
          index: action.payload.index,
          item: piece
        })
      };
    default:
      throw new Error();
  }
}

const Piece = ({
  index,
  kind,
  prettyName,
  children,
  expanded,
  toggleExpanded
}) => {
  const [hover, setHover] = useState(false);

  const onHoverIn = text => {
    setHover(true);
  };

  const onHoverOut = () => {
    setHover(false);
  };

  const description = kind => {
    switch (kind) {
      case "version":
        return <VersionDesc />;
      case "in_num_of":
        return <InputNumDesc />;
      case "ins":
        return <InputDesc />;
      case "out_num_of":
        return <OutputNumDesc />;
      case "outs":
        return <OutputDesc />;
      case "locktime":
        return <LocktimeDesc />;
    }
  };

  return (
    <>
      <div
        onMouseOver={onHoverIn}
        onMouseOut={onHoverOut}
        onClick={() => toggleExpanded(index)}
        className={expanded ? `tx tx_${kind} expanded` : `tx tx_${kind}`}
      >
        <div
          className={`tooltip tx_${kind}`}
          style={{ display: hover || expanded ? "block" : "none" }}
        >
          {prettyName}
        </div>
        <span>{children}</span>
        <div
          className="description"
          style={{ display: expanded ? "block" : "none" }}
        >
          {description(kind)}
        </div>
      </div>
      <style jsx>{`
        :global(p) {
          color: black;
          background-color: #fffac8;
          padding: 1em;
          margin-bottom: 0;
          margin-top: 0;
        }
        .description {
          color: black;
          font-family: Georgia, serif;
          padding-top: 1em;
          padding-bottom: 1em;
        }
        .tx_version {
          background-color: #f58231;
        }

        .tx_in_num_of {
          background-color: #000075;
        }

        .tx_ins {
          background-color: #4363d8;
        }

        .tx_out_num_of {
          background-color: #800000;
        }

        .tx_outs {
          background-color: #e6194b;
        }

        .tx_locktime {
          background-color: #3cb44b;
        }

        .tx {
          display: inline;
          position: relative;
          overflow-wrap: break-word;
          margin-top: 0;
          margin-bottom: 0;
        }

        .tx.expanded {
          display: block;
          margin-top: 3em;
          background: none;
          color: black;
          clear: both;
        }

        span {
          overflow-wrap: break-word;
          padding-top: 0.25em;
          padding-bottom: 0.25em;
        }

        span:hover {
          color: black;
          background-color: white;
          cursor: pointer;
        }

        .tooltip {
          font-family: Georgia, serif;
          font-style: italic;
          font-weight: bold;
          color: white;
          border: 2px solid black;
          padding-left: 0.25em;
          padding-right: 0.25em;
          position: absolute;
          top: -2em;
          left: 0;
          z-index: 2;
          white-space: nowrap;
        }
      `}</style>
    </>
  );
};

const Home = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const toggleExpanded = key => {
    console.log(key);
    dispatch({ type: "toggle_expand", payload: { index: key } });
  };
  return (
    <div className="container">
      <Head>
        <title>TXP demo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <button
          onClick={() => txp_demo("heya").then(value => console.log(value))}
        >
          TEST WASM
        </button>
        <div className="rawtx">
          <code>
            {state.pieces.map((piece, i) => (
              <Piece
                key={piece.kind}
                index={i}
                kind={piece.kind}
                prettyName={piece.prettyName}
                expanded={piece.expanded}
                toggleExpanded={toggleExpanded}
              >
                {piece.value}
              </Piece>
            ))}
          </code>
        </div>
      </main>

      <style jsx>{`
        .text {
          border: 1px solid pink;
        }
        .rawtx {
          width: 40em;
        }

        code {
          color: white;
          line-height: 1.5em;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 2rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default Home;

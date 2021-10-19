import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Card from "react-bootstrap/Card"
import Container from "react-bootstrap/Container"
import Image from "react-bootstrap/Image"

import { getOS, appStoreLink, playStoreLink } from "./downloadApp"
import ReceiveAmount from "./receiveAmount"
import ReceiveNoAmount from "./receiveNoAmount"
import { gql, useQuery } from "@apollo/client"

const USER_WALLET_ID = gql`
  query userWalletId($username: Username!) {
    userWalletId(username: $username)
  }
`

export default function Receive({
  username,
  amount,
}: {
  username: string
  amount?: number
}) {
  const { error, loading, data } = useQuery(USER_WALLET_ID, {
    variables: {
      username,
    },
  })

  if (error) {
    return <div className="error">{error.message}</div>
  }

  const os = getOS()

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (!data) {
    return null
  }

  const { userWalletId } = data

  return (
    <Container fluid>
      {os === undefined && <br />}
      <Row className="justify-content-md-center">
        <Col md="auto" style={{ padding: 0 }}>
          <Card className="text-center">
            <Card.Header>
              Pay {username}
              {amount ? ` ${amount} Sats` : ""}
            </Card.Header>

            {amount ? (
              <ReceiveAmount userWalletId={userWalletId} amount={amount} />
            ) : (
              <ReceiveNoAmount userWalletId={userWalletId} />
            )}

            <Card.Body>
              {os === "android" && (
                <a href={playStoreLink}>
                  <Image
                    src={process.env.PUBLIC_URL + "/google-play-badge.png"}
                    height="40px"
                    rounded
                  />
                </a>
              )}
              {os === "ios" && (
                <a href={playStoreLink}>
                  <Image
                    src={process.env.PUBLIC_URL + "/apple-app-store.png"}
                    height="40px"
                    rounded
                  />
                </a>
              )}
              {os === undefined && (
                <div>
                  <a href={appStoreLink}>
                    <Image
                      src={process.env.PUBLIC_URL + "/apple-app-store.png"}
                      height="45px"
                      rounded
                    />
                  </a>
                  &nbsp;
                  <a href={playStoreLink}>
                    <Image
                      src={process.env.PUBLIC_URL + "/google-play-badge.png"}
                      height="45px"
                      rounded
                    />
                  </a>
                </div>
              )}
            </Card.Body>
            <Card.Footer className="text-muted">
              Powered by <Card.Link href="https://galoy.io">Galoy </Card.Link>
              <br />
              <Card.Link href={window.location.origin}>Open a channel with us</Card.Link>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
      <br />
    </Container>
  )
}
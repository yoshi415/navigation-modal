import Modal from 'react-bootstrap/lib/Modal';

/* Usage
  import NavigationModal from './NavigationModal';

  const {route, router} = this.props;

  <NavigationModal
    route={route} // passed from react router 3
    router={router} // passed from react router 3
    onConfirm={this.onConfirm.bind(this)} // optional function/action to call on leave
    showModal={this.state.showModal} // boolean to trigger showing modal
  />
*/

export default class NavigationModal extends Component {
  constructor() {
    super();

    this.state = {
      showModal: false
    };

    this.hideModal = () => this.setState({ showModal: false });
    this.showModal = () => this.setState({ showModal: true });
    this.routerWillLeave = this.routerWillLeave.bind(this);
    this.confirm = this.confirm.bind(this);
    this.reject = this.reject.bind(this);
  }

  componentWillMount() {
    const { route, router } = this.props;

    router.setRouteLeaveHook(route, nextLocation => {
      if (nextLocation.state && nextLocation.state.force) {
        return true;
      }

      this.routerWillLeave().then(() => {
        const forcedLocation = Object.assign({}, nextLocation, { state: { force: true } });
        router.push(forcedLocation);
      }).catch(() => { });

      return false;
    });

    asyncSetRouteLeaveHook(this.props.router, this.props.route, this.routerWillLeave);
  }

  confirm() {
    const { onConfirm } = this.props;
    this.resolve();
    onConfirm && onConfirm();
    this.hideModal();
  }

  reject() {
    this.reject();
    this.hideModal();
  }

  routerWillLeave() {
    return new Promise((resolve, reject) => {
      if (this.props.showModal) {
        this.resolve = resolve;
        this.reject = reject;
        this.showModal();
      } else {
        resolve();
      }
    });
  }

  render() {
    const { title, message } = this.props;
    const title = title ? title : 'You have unsaved changes!';
    const message = message ? message : 'Are you sure you want to leave?';

    return (
      <Modal show={this.state.showModal}>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <div>
          <Modal.Body>
            <p>{message}</p>
            <button onClick={this.confirm}>
              Yes
            </button>
            <button onClick={this.reject}>
              No
            </button>
          </Modal.Body>
        </div>
      </Modal>
    );
  }
}
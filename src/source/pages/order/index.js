import connect from '../../utils/mvp';
import model from './order.model';
import presenter from './order';
import view from './order.view';

export default connect(model, presenter, view);

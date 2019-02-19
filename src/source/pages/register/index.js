import connect from '../../utils/mvp';
import model from './register.model';
import presenter from './register';
import view from './register.view';

export default connect(model, presenter, view);

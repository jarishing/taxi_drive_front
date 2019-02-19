import connect from '../../utils/mvp';
import model from './main.model';
import presenter from './main';
import view from './main.view';

export default connect(model, presenter, view);

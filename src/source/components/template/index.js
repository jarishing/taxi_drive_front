import connect from '../../utils/mvp';
import model from './template.model';
import presenter from './template';
import view from './template.view';

export default connect(model, presenter, view);

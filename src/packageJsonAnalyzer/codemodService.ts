import { EngineService } from '../components/engineService';
import { Store } from '../data';
import { actions } from '../data/slice';

export class CodemodService {
	constructor(
		private readonly __engineService: EngineService,
		private readonly __store: Store,
	) {}

	haltCurrentCodemodExecution = () => {
		this.__engineService.shutdownEngines();
	};

	public async fetchCodemods() {
		try {
			const codemods = await this.__engineService.getCodemodList();
			this.__store.dispatch(actions.upsertCodemods(codemods));
		} catch (e) {
			console.error(e);
		}
	}
}

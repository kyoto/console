import * as React from 'react';
import { InfoCircleIcon } from '@patternfly/react-icons/dist/esm/icons/info-circle-icon';
import { useTranslation } from 'react-i18next';
import { ShortcutTable, Shortcut } from '@console/shared';

import './RegroupHint.scss';

const RegroupHint: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="odc-regroup-hint">
      <InfoCircleIcon className="odc-regroup-hint__icon" />
      <span className="odc-regroup-hint__text">
        <ShortcutTable>
          <Shortcut shift drag>
            {t('topology~Edit application grouping')}
          </Shortcut>
        </ShortcutTable>
      </span>
    </div>
  );
};

export default RegroupHint;

import * as React from 'react';
import { Card } from '@patternfly/react-core';
import { shallow } from 'enzyme';
import {
  DataState,
  PipelineExampleNames,
  pipelineTestData,
} from '../../../../test-data/pipeline-data';
import { PipelineMetricsLevel } from '../../const';
import * as hookUtils from '../../hooks';
import { usePipelineMetricsLevel } from '../../utils/pipeline-operator';
import { MetricsQueryPrefix } from '../pipeline-metrics-utils';
import PipelineMetrics from '../PipelineMetrics';
import PipelineMetricsEmptyState from '../PipelineMetricsEmptyState';
import PipelineMetricsQuickstart from '../PipelineMetricsQuickstart';
import PipelineMetricsRefreshDropdown from '../PipelineMetricsRefreshDropdown';
import PipelineMetricsTimeRangeDropdown from '../PipelineMetricsTimeRangeDropdown';
import PipelineMetricsUnsupported from '../PipelineMetricsUnsupported';
import PipelineRunCount from '../PipelineRunCount';
import PipelineRunDurationGraph from '../PipelineRunDurationGraph';
import PipelineRunTaskRunGraph from '../PipelineRunTaskRunGraph';
import PipelineSuccessRatioDonut from '../PipelineSuccessRatioDonut';

jest.mock('@console/internal/components/utils/k8s-get-hook', () => ({
  useK8sGet: jest.fn(),
}));

jest.mock('../../utils/pipeline-operator', () => ({
  usePipelineMetricsLevel: jest.fn(),
}));

const mockUsePipelineMetricsLevel = usePipelineMetricsLevel as jest.Mock;

const latestPipelineRunSpy = jest.spyOn(hookUtils, 'useLatestPipelineRun');

const mockData = pipelineTestData[PipelineExampleNames.WORKSPACE_PIPELINE];
const { pipeline } = mockData;
const pipelineRun = mockData.pipelineRuns[DataState.SUCCESS];

type PipelineMetricsProps = React.ComponentProps<typeof PipelineMetrics>;

describe('Pipeline Metrics', () => {
  let PipelineMetricsProps: PipelineMetricsProps;
  mockUsePipelineMetricsLevel.mockReturnValue({
    queryPrefix: MetricsQueryPrefix.TEKTON_PIPELINES_CONTROLLER,
    metricsLevel: PipelineMetricsLevel.PIPELINERUN_TASKRUN_LEVEL,
    hasUpdatePermission: true,
  });
  beforeEach(() => {
    PipelineMetricsProps = {
      obj: pipeline,
    };
  });

  it('Should render an empty state if pipeline is not started', () => {
    latestPipelineRunSpy.mockReturnValue(null);
    const pipelineMetricsWrapper = shallow(<PipelineMetrics {...PipelineMetricsProps} />);
    expect(pipelineMetricsWrapper.find(PipelineMetricsEmptyState).exists()).toBe(true);
  });

  it('Should render pipeline Metrics graph if the pipeline is started', () => {
    latestPipelineRunSpy.mockReturnValue(pipelineRun);
    const pipelineMetricsWrapper = shallow(<PipelineMetrics {...PipelineMetricsProps} />);
    expect(pipelineMetricsWrapper.find(PipelineMetricsEmptyState).exists()).toBe(false);
    expect(pipelineMetricsWrapper.find(Card)).toHaveLength(4);

    expect(pipelineMetricsWrapper.find(PipelineMetricsTimeRangeDropdown).exists()).toBe(true);
    expect(pipelineMetricsWrapper.find(PipelineMetricsRefreshDropdown).exists()).toBe(true);

    expect(pipelineMetricsWrapper.find(PipelineSuccessRatioDonut).exists()).toBe(true);
    expect(pipelineMetricsWrapper.find(PipelineRunCount).exists()).toBe(true);
    expect(pipelineMetricsWrapper.find(PipelineRunDurationGraph).exists()).toBe(true);
    expect(pipelineMetricsWrapper.find(PipelineRunTaskRunGraph).exists()).toBe(true);
  });

  it('Should render only success ratio and number of pipeline runs charts if the metrics level is set to pipeline /task (default) level', () => {
    latestPipelineRunSpy.mockReturnValue(pipelineRun);
    mockUsePipelineMetricsLevel.mockReturnValue({
      queryPrefix: MetricsQueryPrefix.TEKTON_PIPELINES_CONTROLLER,
      metricsLevel: PipelineMetricsLevel.PIPELINE_TASK_LEVEL,
      hasUpdatePermission: true,
    });
    const pipelineMetricsWrapper = shallow(<PipelineMetrics {...PipelineMetricsProps} />);
    expect(pipelineMetricsWrapper.find(PipelineMetricsEmptyState).exists()).toBe(false);
    expect(pipelineMetricsWrapper.find(Card)).toHaveLength(2);

    expect(pipelineMetricsWrapper.find(PipelineMetricsTimeRangeDropdown).exists()).toBe(true);
    expect(pipelineMetricsWrapper.find(PipelineMetricsRefreshDropdown).exists()).toBe(true);

    expect(pipelineMetricsWrapper.find(PipelineSuccessRatioDonut).exists()).toBe(true);
    expect(pipelineMetricsWrapper.find(PipelineRunCount).exists()).toBe(true);
    expect(pipelineMetricsWrapper.find(PipelineRunDurationGraph).exists()).toBe(false);
    expect(pipelineMetricsWrapper.find(PipelineRunTaskRunGraph).exists()).toBe(false);
  });

  it('Should contain quickstart link if the metrics level is set to pipeline /task (default) level', () => {
    latestPipelineRunSpy.mockReturnValue(pipelineRun);
    mockUsePipelineMetricsLevel.mockReturnValue({
      queryPrefix: MetricsQueryPrefix.TEKTON_PIPELINES_CONTROLLER,
      metricsLevel: PipelineMetricsLevel.PIPELINE_TASK_LEVEL,
      hasUpdatePermission: true,
    });
    const pipelineMetricsWrapper = shallow(<PipelineMetrics {...PipelineMetricsProps} />);

    expect(pipelineMetricsWrapper.find(PipelineMetricsQuickstart).exists()).toBe(true);
  });

  it('Should contain quickstart link if the user has update permission', () => {
    latestPipelineRunSpy.mockReturnValue(pipelineRun);
    mockUsePipelineMetricsLevel.mockReturnValue({
      queryPrefix: MetricsQueryPrefix.TEKTON_PIPELINES_CONTROLLER,
      metricsLevel: PipelineMetricsLevel.PIPELINE_TASK_LEVEL,
      hasUpdatePermission: true,
    });
    const pipelineMetricsWrapper = shallow(<PipelineMetrics {...PipelineMetricsProps} />);

    expect(pipelineMetricsWrapper.find(PipelineMetricsQuickstart).exists()).toBe(true);
  });

  it('Should not contain quickstart link if the user does not have update permission', () => {
    latestPipelineRunSpy.mockReturnValue(pipelineRun);
    mockUsePipelineMetricsLevel.mockReturnValue({
      queryPrefix: MetricsQueryPrefix.TEKTON_PIPELINES_CONTROLLER,
      metricsLevel: PipelineMetricsLevel.PIPELINE_TASK_LEVEL,
      hasUpdatePermission: false,
    });
    const pipelineMetricsWrapper = shallow(<PipelineMetrics {...PipelineMetricsProps} />);

    expect(pipelineMetricsWrapper.find(PipelineMetricsQuickstart).exists()).toBe(false);
  });

  it('Should not contain quickstart link if the metrics level is set to pipelinerun /taskrun level', () => {
    latestPipelineRunSpy.mockReturnValue(pipelineRun);
    mockUsePipelineMetricsLevel.mockReturnValue({
      queryPrefix: MetricsQueryPrefix.TEKTON_PIPELINES_CONTROLLER,
      metricsLevel: PipelineMetricsLevel.PIPELINERUN_TASKRUN_LEVEL,
      hasUpdatePermission: true,
    });
    const pipelineMetricsWrapper = shallow(<PipelineMetrics {...PipelineMetricsProps} />);

    expect(pipelineMetricsWrapper.find(PipelineMetricsQuickstart).exists()).toBe(false);
  });

  it('Should render Pipeline Metrics Unsupported empty page', () => {
    latestPipelineRunSpy.mockReturnValue(pipelineRun);
    mockUsePipelineMetricsLevel.mockReturnValue({
      queryPrefix: MetricsQueryPrefix.TEKTON_PIPELINES_CONTROLLER,
      metricsLevel: PipelineMetricsLevel.UNSUPPORTED_LEVEL,
      hasUpdatePermission: true,
    });
    const pipelineMetricsWrapper = shallow(<PipelineMetrics {...PipelineMetricsProps} />);

    expect(pipelineMetricsWrapper.find(PipelineMetricsUnsupported).exists()).toBe(true);
  });
});

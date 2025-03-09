<template>
	<q-timeline class="events">
		<template v-for="(period, periodIndex) in periods" :key="periodIndex">
			<q-timeline-entry heading>
				{{ $t(`period.${period[0]}`) }}
			</q-timeline-entry>
			<q-timeline-entry
				v-for="(event, eventIndex) in period[1]"
				:key="eventIndex"
				:subtitle="`${period[0] === 'PEN' ? '' : event.time} ${$t(
					`eventType.${event.type}`
				)}`"
			>
				<div class="score">
					{{ event.runningScoreHome }}
					-
					{{ event.runningScoreAway }}
				</div>
				<img
					v-if="event.teamId === match.homeTeamId"
					:src="match.homeTeamLogo ?? ''"
					:alt="match.homeTeamName"
				/>
				<img
					v-if="event.teamId === match.awayTeamId"
					:src="match.awayTeamLogo ?? ''"
					:alt="match.awayTeamName"
				/>
				<div v-if="event.code === 'OG'" class="own-goal">
					{{ $t('eventType.ownGoal') }}
				</div>
				<div v-else-if="event.type === EVENT_TYPE.TIMEOUT" class="timeout">
					<template v-if="event.teamId === match.homeTeamId">
						{{ match.awayTeamName }}
					</template>
					<template v-else>
						{{ match.awayTeamName }}
					</template>
				</div>
				<div v-else-if="event.player1Name" class="players">
					<div>
						{{ event.player1Name }}
					</div>
					<div v-if="event.player2Id">({{ event.player2Name }})</div>
				</div>
				<div
					v-if="event.penalty !== '' && event.code !== 'MPS'"
					class="penalty"
				>
					{{ $t(`penalties.${event.code}`) }}
				</div>
			</q-timeline-entry>
			<q-timeline-entry
				v-if="periodIndex < periods.size - 1 || match.isFinished"
				:subtitle="period[0] === 'PEN' ? $t('period.endOfMatch') : '20:00'"
			>
				{{ getScore(period[1].slice(-1)[0]) }}
				<q-icon name="sym_o_sports" size="lg" />
				<span v-if="periodIndex < periods.size - 1" class="end-of-period">
					{{ $t('period.endOfPeriod') }}
				</span>
				<span v-else class="end-of-match">
					{{ $t('period.endOfMatch') }}
				</span>
			</q-timeline-entry>
		</template>
	</q-timeline>
</template>

<script setup lang="ts">
import { EVENT_TYPE } from 'src/enums/EVENT_TYPE';
import MatchEventInfo from 'src/models/MatchEventInfo';
import MatchInfo from 'src/models/MatchInfo';

defineProps<{
	match: MatchInfo;
	periods: Map<string, MatchEventInfo[]>;
}>();

const getScore = (event: MatchEventInfo) =>
	`${event.runningScoreHome} - ${event.runningScoreAway}`;
</script>

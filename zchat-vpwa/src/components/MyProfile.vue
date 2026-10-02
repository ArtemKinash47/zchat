<template>
	<q-dialog v-model="isOpen">
		<q-card style="min-width: 750px; height: 750px">
			<q-card-section class="row items-center q-pb-none">
				<div class="text-h6">Profile</div>
				<q-space />
				<q-btn icon="close" flat round dense v-close-popup aria-label="Close profile" />
			</q-card-section>
			<q-card-section class="profile-fields column items-center justify-between">
				<q-avatar size="72px" color="primary" text-color="white">JD</q-avatar>
				<q-input
					v-model="name"
					clearable
					clear-icon="close"
					filled
					color="secondary"
					label="Name"
					class="profile-input"
				/>
				<q-input
					v-model="surname"
					clearable
					clear-icon="close"
					filled
					color="secondary"
					label="Surname"
					class="profile-input"
				/>
				<q-input
					v-model="nickname"
					clearable
					clear-icon="close"
					filled
					color="secondary"
					label="Nickname"
					class="profile-input"
				/>
				<q-input
					v-model="email"
					clearable
					clear-icon="close"
					filled
					color="secondary"
					label="Email"
					type="email"
					class="profile-input"
				/>
				<q-input
					v-model="password"
					filled
					:type="isPwd ? 'password' : 'text'"
					hint="Enter your password to save changes"
					class="profile-input"
				>
					<template #append>
						<q-icon
							:name="isPwd ? 'visibility_off' : 'visibility'"
							class="cursor-pointer"
							@click="isPwd = !isPwd"
						/>
					</template>
				</q-input>
				<q-input
					v-model="passwordConf"
					filled
					:type="isPwdConf ? 'password' : 'text'"
					hint="Confirm your password to save changes"
					class="profile-input"
				>
					<template #append>
						<q-icon
							:name="isPwdConf ? 'visibility_off' : 'visibility'"
							class="cursor-pointer"
							@click="isPwdConf = !isPwdConf"
						/>
					</template>
				</q-input>
				<q-btn color="primary" label="Save Changes" v-close-popup />
				<q-btn color="negative" label="Discard Changes" v-close-popup />
			</q-card-section>
		</q-card>
	</q-dialog>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = defineModel({ type: Boolean, default: false })

const name = ref('')
const surname = ref('')
const nickname = ref('')
const email = ref('')
const password = ref('')
const passwordConf = ref('')
const isPwd = ref(true)
const isPwdConf = ref(true)
</script>

<style scoped>
.profile-input {
	width: 100%;
	max-width: 400px;
}

.profile-fields {
	gap: 25px;
}
</style>
